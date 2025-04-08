// matcher.js
class Matcher {
  constructor(mentors, mentees) {
    this.mentors = mentors.map(m => ({
      ...m,
      preferences: m.preferences || [],
      matches: [],
      maxSpots: m.maxSpots || 1
    }));

    this.mentees = mentees.map(e => ({
      ...e,
      preferences: e.preferences || [],
      currentProposal: 0,
      matched: false
    }));
  }

  run() {
    let hasUnmatched;
    do {
      hasUnmatched = false;
      this.mentees.forEach(mentee => {
        if (!mentee.matched && mentee.currentProposal < mentee.preferences.length) {
          const mentorId = mentee.preferences[mentee.currentProposal];
          const mentor = this.mentors.find(m => m._id.equals(mentorId));
          
          if (mentor) {
            mentor.matches.push(mentee);
            this.evaluateMatches(mentor);
          }
          
          mentee.currentProposal++;
          hasUnmatched = true;
        }
      });
    } while (hasUnmatched);
  }

  evaluateMatches(mentor) {
    // Sort matches by mentor's preferences
    mentor.matches.sort((a, b) => {
      const aIndex = mentor.preferences.findIndex(id => id.equals(a._id));
      const bIndex = mentor.preferences.findIndex(id => id.equals(b._id));
      return aIndex - bIndex;
    });

    // Trim excess matches using maxSpots
    while (mentor.matches.length > mentor.maxSpots) {
      const rejected = mentor.matches.pop();
      rejected.matched = false;
    }

    // Update matched status
    mentor.matches.forEach(m => m.matched = true);
  }

  getUnmatched() {
    return {
      unmatchedMentees: this.mentees.filter(mentee => !mentee.matched),
      unmatchedMentors: this.mentors.filter(mentor => 
        mentor.matches.length < mentor.maxSpots
      )
    };
  }
}

module.exports = Matcher;