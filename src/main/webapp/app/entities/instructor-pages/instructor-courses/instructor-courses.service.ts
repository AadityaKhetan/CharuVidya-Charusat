import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourse, getCourseIdentifier } from '../../course/course.model';

export type EntityResponseType = HttpResponse<ICourse>;
export type EntityArrayResponseType = HttpResponse<ICourse[]>;

@Injectable({ providedIn: 'root' })
export class InstructorCoursesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(data: any): Observable<EntityResponseType> {
    return this.http.post<ICourse>('api/instructor-course', data, { observe: 'response' });
  }
  update(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .put<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .patch<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICourse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCourseToCollectionIfMissing(courseCollection: ICourse[], ...coursesToCheck: (ICourse | null | undefined)[]): ICourse[] {
    const courses: ICourse[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const courseCollectionIdentifiers = courseCollection.map(courseItem => getCourseIdentifier(courseItem)!);
      const coursesToAdd = courses.filter(courseItem => {
        const courseIdentifier = getCourseIdentifier(courseItem);
        if (courseIdentifier == null || courseCollectionIdentifiers.includes(courseIdentifier)) {
          return false;
        }
        courseCollectionIdentifiers.push(courseIdentifier);
        return true;
      });
      return [...coursesToAdd, ...courseCollection];
    }
    return courseCollection;
  }

  public getCourses(): Observable<EntityArrayResponseType> {
    return this.http.get<ICourse[]>(this.resourceUrl, { observe: 'response' });
  }

  public approveCourse(courseId: string): Observable<HttpResponse<{}>> {
    return this.http.get(`${this.resourceUrl}/${courseId}/forApproval`, { observe: 'response' });
  }

  protected convertDateFromClient(course: ICourse): ICourse {
    return Object.assign({}, course, {
      courseCreatedOn: course.courseCreatedOn?.isValid() ? course.courseCreatedOn.format(DATE_FORMAT) : undefined,
      courseUpdatedOn: course.courseUpdatedOn?.isValid() ? course.courseUpdatedOn.format(DATE_FORMAT) : undefined,
      courseApprovalDate: course.courseApprovalDate?.isValid() ? course.courseApprovalDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.courseCreatedOn = res.body.courseCreatedOn ? dayjs(res.body.courseCreatedOn) : undefined;
      res.body.courseUpdatedOn = res.body.courseUpdatedOn ? dayjs(res.body.courseUpdatedOn) : undefined;
      res.body.courseApprovalDate = res.body.courseApprovalDate ? dayjs(res.body.courseApprovalDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((course: ICourse) => {
        course.courseCreatedOn = course.courseCreatedOn ? dayjs(course.courseCreatedOn) : undefined;
        course.courseUpdatedOn = course.courseUpdatedOn ? dayjs(course.courseUpdatedOn) : undefined;
        course.courseApprovalDate = course.courseApprovalDate ? dayjs(course.courseApprovalDate) : undefined;
      });
    }
    return res;
  }
}
