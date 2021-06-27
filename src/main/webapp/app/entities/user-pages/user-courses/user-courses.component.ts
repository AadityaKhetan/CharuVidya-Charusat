import { Component, OnInit } from '@angular/core';
import { ICourse } from 'app/entities/course/course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserCourseService } from 'app/entities/user-pages/user-courses/user-courses.service';
import { HttpResponse } from '@angular/common/http';
import { ICourseCategory } from 'app/entities/course-category/course-category.model';

@Component({
  selector: 'jhi-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss'],
})
export class UserCoursesComponent implements OnInit {
  courses?: ICourse[] | null;
  categoryId!: string | null;

  constructor(
    protected userCourseService: UserCourseService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAllCourses();
  }

  private loadAllCourses(): void {
    const hasCategoryId: boolean = this.activatedRoute.snapshot.paramMap.has('categoryId');
    if (hasCategoryId) {
      this.categoryId = this.activatedRoute.snapshot.paramMap.get('categoryId');
    }
    if (this.categoryId !== null) {
      this.userCourseService.query(this.categoryId).subscribe(
        (res: HttpResponse<ICourseCategory[]>) => {
          this.courses = res.body;
        },
        () => {
          window.alert('Error in fetching parent categories');
        }
      );
    }
  }
}
