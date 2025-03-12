const { MongoClient, ObjectId } = require('mongodb');
const Matcher = require('./matcher');

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
      // Fetches bigs and littles if an event is supposed to be triggered
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

      const matcher = new Matcher(mentors, mentees);
      if (mentors.length === 0 || mentees.length === 0) {
        console.log('No mentors or mentees found for event:', event._id);
        continue; 
      }
      matcher.run();

      // Update mentors' matches
      await Promise.all(matcher.mentors.map(async (mentor) => {
        await db.collection('profiles').updateOne(
          { _id: new ObjectId(mentor._id) },
          { $set: { matches: mentor.matches.map(m => new ObjectId(m._id)) } }
        );
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
        );
      }));

      // Mark event as processed
      await db.collection('events').updateOne(
        { _id: event._id },
        { $set: { matchingRun: true } }
      );
    }
  } catch (error) {
    console.error('Matching failed:', error);
    throw error;
  } finally {
    await client.close();
  }
};