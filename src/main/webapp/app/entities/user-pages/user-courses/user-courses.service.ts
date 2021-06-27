import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICourse } from '../../course/course.model';

export type EntityArrayResponseType = HttpResponse<ICourse[]>;

@Injectable({ providedIn: 'root' })
export class UserCourseService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  query(id: string): Observable<EntityArrayResponseType> {
    return this.http.get<ICourse[]>(`${this.resourceUrl}/category/${id}`, { observe: 'response' });
  }
}
