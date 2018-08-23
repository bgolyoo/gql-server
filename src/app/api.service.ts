import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryResult, gql } from 'apollo-angular-boost';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Course {
  title: string;
  author: string;
  description: string;
  topic: string;
  url: string;
}

const COURSE_FRAGMENT = gql`
  fragment courseFields on Course {
    id
    title
    author
    description
    topic
    url
  }
`;

const COURSE_QUERY = gql`
  query getCourse($courseId: Int!) {
    course(id: $courseId) {
      ...courseFields
    }
  }
  ${COURSE_FRAGMENT}
`;

const COURSES_QUERY = gql`
  {
    courses {
      ...courseFields
    }
  }
  ${COURSE_FRAGMENT}
`;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private apollo: Apollo) {}

  fetchCourse(courseId: number): Observable<Course> {
    return this.apollo
      .watchQuery({
        query: COURSE_QUERY,
        variables: {
          courseId: courseId
        }
      })
      .valueChanges.pipe(map((resp: ApolloQueryResult<any>) => resp.data.course));
  }

  fetchCourses(): Observable<Array<Course>> {
    const query = this.apollo.watchQuery({ query: COURSES_QUERY });
    return query.valueChanges.pipe(map((resp: ApolloQueryResult<any>) => resp.data.courses));
  }
}
