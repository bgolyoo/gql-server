import { Component, OnInit } from '@angular/core';
import { ApiService, Course } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  courses: Array<Course> | null = null;
  course: Course | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourse(courseId: number) {
    this.api.fetchCourse(courseId).subscribe((course: Course) => {
      console.log(course);
      this.course = course;
    });
  }

  fetchCourses() {
    this.api.fetchCourses().subscribe((courses: Array<Course>) => {
      console.log(courses);
      this.courses = courses;
    });
  }

  select(courseId: number) {
    this.fetchCourse(courseId);
  }
}
