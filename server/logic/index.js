const { MongoClient, ObjectId } = require('mongodb');
const Matcher = require('./matching');


/**
 * Calculates weighted preferences for profiles based on swipes and round weights
 * @param {Array} profiles - Array of mentor or mentee profiles
 * @param {String} targetRole - 'Big' or 'Little' - which role we're calculating preferences for
 * @param {Object} organization - The organization document with roundWeighting
 * @param {Array} allMentors - All mentor profiles for reference
 * @param {Array} allMentees - All mentee profiles for reference
 * @returns {Array} - Profiles with calculated preferences
 */

const calculateWeightedPreferences = (profiles, targetRole, organization, allMentors, allMentees) => {
  const scoreMap = new Map();
      
  // First pass: Calculate all scores
  profiles.forEach(profile => {
    profile.rounds.forEach((round, roundIndex) => {
      const weight = organization.roundWeighting[roundIndex] || 1;
      round.swipesRight.forEach(targetId => {
        const key = targetId.toString();
        scoreMap.set(key, (scoreMap.get(key) || 0) + weight);
      });
    });
  });

  // Second pass: Generate sorted preferences
  return profiles.map(profile => {
    const preferences = [];
    const seen = new Set();
    
    // Process rounds in reverse to prioritize later rounds
    [...profile.rounds].reverse().forEach((round, reverseIndex) => {
      const roundIndex = profile.rounds.length - 1 - reverseIndex;
      const weight = organization.roundWeighting[roundIndex];
      
      round.swipesRight.forEach(targetId => {
        const target = allMentors.concat(allMentees).find(p => 
          p._id.equals(targetId) && p.role === targetRole
        );
        
        if (target && !seen.has(targetId.toString())) {
          seen.add(targetId.toString());
          preferences.push({
            id: targetId,
            score: scoreMap.get(targetId.toString()) || 0,
            roundWeight: weight
          });
        }
      });
    });

    // Sort by score (descending), then by round weight (descending)
    return {
      ...profile,
      preferences: preferences
        .sort((a, b) => b.score - a.score || b.roundWeight - a.roundWeight)
        .map(p => p.id)
    };
  });
};

exports.handler = async (event) => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();

    // Get active events needing matching
    const now = new Date();
    const events = await db.collection('events')
      .find({ endTime: { $lte: now }, matchingRun: false })
      .toArray();

    for (const event of events) {
      // Update organization matching status
      await db.collection('organizations').updateOne(
        { _id: event.organization },
        { $set: { isMatching: now >= event.startTime && now <= event.endTime } }
      );

      // Find the organization for the event
      const organization = await db.collection('organizations').findOne({ 
        _id: event.organization 
      });

      if (!organization) {
        console.log('Organization not found for event:', event._id);
        continue;
      }

      // Check if this is the final round (0-indexed)
      const isFinalRound = organization.currentRound >= organization.rounds - 1;

      // Fetches bigs and littles if an event is supposed to be triggered
      if (isFinalRound) {
      const [mentors, mentees] = await Promise.all([
        db.collection('profiles').find({
          organizationId: event.organization, 
          role: 'Big'
        }).toArray(),
        db.collection('profiles').find({
          organizationId: event.organization, 
          role: 'Little'
        }).toArray()
      ]).catch(error => {
        console.error('Error fetching profiles:', error);
        throw error;
      });

      if (mentors.length === 0 || mentees.length === 0) {
        console.log('No mentors or mentees found for event:', event._id);
        continue; 
      }

      const mentorsWithPrefs = calculateWeightedPreferences(allMentors, 'Big', organization, allMentors, allMentees);
      const menteesWithPrefs = calculateWeightedPreferences(allMentees, 'Little', organization, allMentors, allMentees);

      const matcher = new Matcher(mentorsWithPrefs, menteesWithPrefs);
      matcher.run();

      // Update mentors' matches
      await Promise.all(matcher.mentors.map(async (mentor) => {
        await db.collection('profiles').updateOne(
          { _id: new ObjectId(mentor._id) },
          { $set: { matches: mentor.matches.map(m => new ObjectId(m._id)) } }
        ).catch(error => {
          console.error('Error updating mentor matches:', error);
          throw error;
        });
      }));

      // Build mentee to mentor mapping
      const menteeMentorMap = new Map();
      matcher.mentors.forEach(mentor => {
        mentor.matches.forEach(mentee => {
          menteeMentorMap.set(mentee._id.toString(), mentor._id);
        });
      });

      // Update mentees' matches
      await Promise.all(Array.from(menteeMentorMap.entries()).map(async ([menteeId, mentorId]) => {
        await db.collection('profiles').updateOne(
          { _id: new ObjectId(menteeId) },
          { $set: { matches: [new ObjectId(mentorId)] } }
        ).catch(error => {
          console.error('Error updating mentee matches:', error);
          throw error;
        });
      }));

      // Return the unmatched people
      const { unmatchedMentees, unmatchedMentors } = matcher.getUnmatched();

      await db.collection('organizations').updateOne(
        { _id: event.organization },
        { $set: { unMatched: [...unmatchedMentees.map(m => m._id), ...unmatchedMentors.map(m => m._id)] } }
      ).catch(error => {
        console.error('Error updating organization with unmatched users:', error);
        throw error;
      });

      // Mark event as processed, always runs
      await db.collection('events').updateOne(
        { _id: event._id },
        { $set: { matchingRun: true } }
      ).catch(error => {
        console.error('Error marking event as processed:', error);
        throw error;
      });

    } else {

      // Increment current round
      await db.collection('organizations').updateOne(
        { _id: event.organization },
        { $inc: { currentRound: 1 } }
      );

    }

      console.log('Event processed successfully:', event._id);
      
    }
  } catch (error) {
    console.error('Matching failed:', error);
    throw error;
  } finally {
    await client.close();
  }
};