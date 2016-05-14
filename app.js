School = new Mongo.Collection('school');

School.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});

if (Meteor.isServer) {
  // Seed Collection
  if (!School.findOne()) {
    School.insert({
     zipcode: '63109',
     students: [
                  { name: 'john', school: 102, age: 10 },
                  { name: 'jeff', school: 108, age: 15 }
               ]
    })
  }

  Meteor.publish('school', function () {
      // Projection operator
      var school = School.find({}, { students: { $elemMatch: { school: 102 } } });
      console.log('Project Operator');
      console.log(school.fetch()[0].students);

      // Query operator
      var school2 = School.find({ students: { $elemMatch: { school: 102 } } });
      console.log('Query Operator');
      console.log(school2.fetch()[0].students);

      // Fields
      var school3 = School.find({}, { fields: { students: { $elemMatch: { school: 102 } } } });
      console.log('Fields Operator');
      console.log(school3.fetch()[0].students);
      // Returns All Students instead of only the $elemMatch { school: 102 }

      // Running the same query in Meteor Mongo returns only ONE student:
      // QUERY:   db.school.find({}, { students: { $elemMatch: { school: 102 } } })
      // RESULT:  { "_id" : "qS56LKh9L4n53kkuT", "students" : [ { "name" : "john", "school" : 102, "age" : 10 } ] }

      return school;
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('school');
}
