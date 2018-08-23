var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
];

var getCourse = (args) => {
    return coursesData.filter(course => course.id === args.id).shift();
};

var getCourses = (args) => {
    if (args.topic) {
        return coursesData.filter(course => course.topic === args.topic)
    } else {
        return coursesData;
    }
};

var updateCourseTopic = ({ id, topic }) => {
    const courseToUpdate = coursesData.find(course => course.id === id);
    if (!!courseToUpdate) {
        courseToUpdate.topic = topic;
        return courseToUpdate;
    }
};

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server now running on localhost:4000/graphql'));

// TO MUTATE DATA:
// mutation updateCourseTopic($id: Int!, $topic: String!) {
//     updateCourseTopic(id: $id, topic: $topic) {
//         ...courseFields
//     }
// }
// fragment courseFields on Course {
//     title
//     author
//     description
//     topic
//     url
// }
// {
//     "id": 11,
//     "topic": "Somethinh"
// }

// QUERY WITH FRAGMENTS:
// query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
//     course1: course(id: $courseID1) {
//       ...courseFields
//     }
//     course2: course(id: $courseID2) {
//       ...courseFields
//     }
// }  
// fragment courseFields on Course {
//     title
//     author
//     description
//     topic
//     url
// }
// { 
//     "courseID1":1,
//     "courseID2":2
// }

// SIMPLE QUERY TO GET A SIMPLE COURSE:
// query getCourse($courseID: Int!) {
//     course(id: $courseID) {
//       title
//       author
//       description
//       topic
//       url
//     }
// }
// {"courseID": 1}
  