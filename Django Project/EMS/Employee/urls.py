from django.urls import path
from .views import (
    EmployeeCreateView, EmployeeListView, EmployeeUpdateView, EmployeeDeleteView, EmployeeDepartmentView, EmployeeDetailView,
    DepartmentCreateView, DepartmentListView, DepartmentUpdateView, DepartmentDetailView, DepartmentDeleteView, DepartmentTotalSalaryView,
    ProjectListView, ProjectCreateView, ProjectDetailView, ProjectDeleteView, ProjectAddMemberView, ProjectBudgetView, ProjectUpdateStatusView, NewProjectsView, OngoingProjectsView, EndedProjectsView, HighestSalaryEmployeeView, SecondHighestSalaryEmployeeView,    
)    

urlpatterns = [

    # Employee APIs
    path('employee/create/', EmployeeCreateView.as_view()),
    path('employee/', EmployeeListView.as_view()),
    path('employee/<int:id>/', EmployeeDetailView.as_view()), 
    path('employee/<int:id>/update/', EmployeeUpdateView.as_view()),
    path('employee/<int:id>/delete/', EmployeeDeleteView.as_view()),
    path('employee/<int:id>/department/', EmployeeDepartmentView.as_view()),

    # Department APIs
    path('department/', DepartmentListView.as_view()),
    path('department/create/', DepartmentCreateView.as_view()),
    path('department/<int:id>/department-with-employee/', DepartmentDetailView.as_view()),
    path('department/<int:id>/update/', DepartmentUpdateView.as_view()),
    path('department/<int:id>/delete/', DepartmentDeleteView.as_view()),

    # Project APIs
    path('project/', ProjectListView.as_view()),
    path('project/create/', ProjectCreateView.as_view()),
    path('project/<int:id>/', ProjectDetailView.as_view()),
    path('project/<int:id>/delete/', ProjectDeleteView.as_view()),
    path('project/<int:id>/update-status/', ProjectUpdateStatusView.as_view()),
    path('project/<int:id>/add-member/', ProjectAddMemberView.as_view()),
    path('project/<int:id>/budget/', ProjectBudgetView.as_view()),
    path('employee/highest-salary/', HighestSalaryEmployeeView.as_view()),
    path('employee/second-highest-salary/', SecondHighestSalaryEmployeeView.as_view()),
    path('department/total-salary/', DepartmentTotalSalaryView.as_view()),
    path('project/status-new/', NewProjectsView.as_view()),
    path('project/status-on-going/', OngoingProjectsView.as_view()),
    path('project/status-ended/', EndedProjectsView.as_view()),
]