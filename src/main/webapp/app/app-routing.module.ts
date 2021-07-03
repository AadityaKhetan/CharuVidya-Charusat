import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserCourseCategoryComponent } from 'app/entities/user-pages/user-course-category/user-course-category.component';
import { UserCourseSubCategoriesComponent } from 'app/entities/user-pages/user-course-sub-categories/user-course-sub-categories.component';
import { UserCoursesComponent } from 'app/entities/user-pages/user-courses/user-courses.component';
import { InstructorCoursesComponent } from 'app/entities/instructor-pages/instructor-courses/instructor-courses.component';
import { InstructorUpdateCoursesComponent } from 'app/entities/instructor-pages/instructor-courses/instructor-update-courses.component';
import { InstructorCoursesectionComponent } from 'app/entities/instructor-pages/instructor-coursesection/instructor-coursesection.component';
import { InstructorUpdateCoursesectionComponent } from 'app/entities/instructor-pages/instructor-coursesection/instructor-update-coursesection.component';
import { InstructorCourseSessionComponent } from 'app/entities/instructor-pages/instructor-course-session/instructor-course-session.component';
import { InstructorUpdateCourseSessionComponent } from 'app/entities/instructor-pages/instructor-course-session/instructor-update-course-session.component';
import {InstructorSessionViewComponent} from "app/entities/instructor-pages/instructor-course-session/instructor-session-view/instructor-session-view.component";

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN, Authority.FACULTY, Authority.STUDENT, Authority.REVIEWER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'categories',
          data: {
            authorities: [Authority.STUDENT],
          },
          canActivate: [UserRouteAccessService],
          component: UserCourseCategoryComponent,
        },
        {
          path: 'sub-category/:parentId',
          data: {
            authorities: [Authority.STUDENT],
          },
          canActivate: [UserRouteAccessService],
          component: UserCourseSubCategoriesComponent,
        },
        {
          path: 'courses/:categoryId',
          data: {
            authorities: [Authority.STUDENT],
          },
          canActivate: [UserRouteAccessService],
          component: UserCoursesComponent,
        },
        {
          path: 'instructor-courses',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorCoursesComponent,
        },
        {
          path: 'course/add',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorUpdateCoursesComponent,
        },
        {
          path: 'course/:courseId/sections',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorCoursesectionComponent,
        },
        {
          path: 'course/:courseId/section/new',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorUpdateCoursesectionComponent,
        },
        {
          path: 'course/:courseId/sections/section/:courseSectionId/sessions',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorCourseSessionComponent,
        },
        {
          path: 'course/:courseId/sections/section/:courseSectionId/sessions/:sessionId',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorSessionViewComponent,
        },
        {
          path: 'course/:courseId/section/:courseSectionId/add-session',
          data: {
            authorities: [Authority.FACULTY],
          },
          canActivate: [UserRouteAccessService],
          component: InstructorUpdateCourseSessionComponent,
        },
        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
