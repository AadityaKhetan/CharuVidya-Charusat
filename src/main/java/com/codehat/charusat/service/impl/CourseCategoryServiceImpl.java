package com.codehat.charusat.service.impl;

import com.codehat.charusat.domain.CourseCategory;
import com.codehat.charusat.repository.CourseCategoryRepository;
import com.codehat.charusat.repository.CourseRepository;
import com.codehat.charusat.service.CourseCategoryService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CourseCategory}.
 */
@Service
@Transactional
public class CourseCategoryServiceImpl implements CourseCategoryService {

    private final Logger log = LoggerFactory.getLogger(CourseCategoryServiceImpl.class);

    private final CourseCategoryRepository courseCategoryRepository;

    private final CourseRepository courseRepository;

    public CourseCategoryServiceImpl(CourseCategoryRepository courseCategoryRepository, CourseRepository courseRepository) {
        this.courseCategoryRepository = courseCategoryRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseCategory save(CourseCategory courseCategory) {
        log.debug("Request to save CourseCategory : {}", courseCategory);
        return courseCategoryRepository.save(courseCategory);
    }

    @Override
    public Optional<CourseCategory> partialUpdate(CourseCategory courseCategory) {
        log.debug("Request to partially update CourseCategory : {}", courseCategory);

        return courseCategoryRepository
            .findById(courseCategory.getId())
            .map(
                existingCourseCategory -> {
                    if (courseCategory.getCourseCategoryTitle() != null) {
                        existingCourseCategory.setCourseCategoryTitle(courseCategory.getCourseCategoryTitle());
                    }
                    if (courseCategory.getLogo() != null) {
                        existingCourseCategory.setLogo(courseCategory.getLogo());
                    }
                    if (courseCategory.getIsParent() != null) {
                        existingCourseCategory.setIsParent(courseCategory.getIsParent());
                    }
                    if (courseCategory.getParentId() != null) {
                        existingCourseCategory.setParentId(courseCategory.getParentId());
                    }

                    return existingCourseCategory;
                }
            )
            .map(courseCategoryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseCategory> findAll(Pageable pageable) {
        log.debug("Request to get all CourseCategories");
        return courseCategoryRepository.findAll(pageable);
    }

    @Override
    public List<CourseCategory> findAll() {
        return courseCategoryRepository.findAllCategories();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CourseCategory> findOne(Long id) {
        log.debug("Request to get CourseCategory : {}", id);
        return courseCategoryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CourseCategory : {}", id);
        courseCategoryRepository.deleteById(id);
    }

    @Override
    public List<CourseCategory> listParentCategory() {
        log.debug("Request to list parent categories ");
        List<CourseCategory> list;
        list = courseCategoryRepository.findParentCategory();
        return list;
    }

    @Override
    public List<CourseCategory> listByParentId(Long id) {
        log.debug("request to list sub-categories of category : {}", id);
        List<CourseCategory> list;
        list = courseCategoryRepository.findByParentId(Integer.parseInt(id.toString()));
        return list;
    }

    @Override
    public ResponseEntity<Map<Long, Integer>> getCourseCountBySubCategory(Long parentId) {
        List<CourseCategory> courseCategories = courseCategoryRepository.findByParentId(parentId.intValue());
        Map<Long, Integer> map = new HashMap<>();
        for (CourseCategory category : courseCategories) {
            map.put(category.getId(), courseCategoryRepository.getCourseCountBySubCategory(category.getId()));
        }
        return ResponseEntity.ok().body(map);
    }

    @Override
    public ResponseEntity<Map<Long, Integer>> getCourseCountByParentCategory() {
        List<CourseCategory> courseCategories = courseCategoryRepository.findParentCategory();
        Map<Long, Integer> map = new HashMap<>();
        for (CourseCategory category : courseCategories) {
            map.put(category.getId(), courseCategoryRepository.getCourseCountByParentCategory(category.getId().intValue()));
        }
        return ResponseEntity.ok().body(map);
    }
}
