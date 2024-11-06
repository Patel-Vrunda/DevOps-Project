from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Employee, Department, Project
from .serializers import EmployeeSerializer, DepartmentSerializer, ProjectSerializer
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum, Max


#----------------------------- Employee APIs -----------------------------------

# POST /employee/create/       - Create an Employee
class EmployeeCreateView(APIView) :
    def post(self, request) :
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET /employee/        - Get all employees
class EmployeeListView(APIView) :
    def get(self, request) :
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

# PUT /employee/<id>/update/       - Update employee data by ID
class EmployeeUpdateView(APIView) :
    def put(self, request, id) :
        employee = get_object_or_404(Employee, id=id)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET /employee/<id>/       - Get employee data by ID
class EmployeeDetailView(APIView) :
    def get(self, request, id) :
        employee = get_object_or_404(Employee, id=id)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    
# DELETE /employee/<id>/delete/        - Delete employee by ID
class EmployeeDeleteView(APIView) :
    def delete(self, request, id) :
        employee = get_object_or_404(Employee, id=id)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# GET /employee/<id>/department/        - Get department details by employee ID
class EmployeeDepartmentView(APIView) :
    def get(self, request, id) :
        employee = get_object_or_404(Employee, id=id)
        department = employee.department
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)


#----------------------------- Department APIs -----------------------------------

# POST /department/create/        - Create a department
class DepartmentCreateView(APIView):
    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET /department/         - Get all departments (without employee data)
class DepartmentListView(APIView):
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

# PUT /department/<id>/update/        - Update department data
class DepartmentUpdateView(APIView):
    def put(self, request, id):
        department = get_object_or_404(Department, id=id)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET /department/<id>/department-with-employee        - Get department data along with all employees
class DepartmentDetailView(APIView):
    def get(self, request, id):
        department = get_object_or_404(Department, id=id)
        employees = department.employees.all()  # Using related_name 'employees' to fetch employees in department
        department_serializer = DepartmentSerializer(department)
        employee_serializer = EmployeeSerializer(employees, many=True)
        return Response({
            'department': department_serializer.data,
            'employees': employee_serializer.data
        })

# DELETE /department/<id>/delete         - Delete a department (with validation if employees exist)
class DepartmentDeleteView(APIView):
    def delete(self, request, id):
        department = get_object_or_404(Department, id=id)
        employees = Employee.objects.filter(department=department)
        if employees.exists():  
            return Response({'error': 'Department cannot be deleted because employees are associated with it.'},
                            status=status.HTTP_400_BAD_REQUEST)
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


#----------------------------- Project APIs -----------------------------------

# POST /project/create      - Create a new project
class ProjectCreateView(APIView) :
    def post(self, request) :
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET /project/         - Get all projects (with team members data)
class ProjectListView(APIView):
    def get(self, request):
        projects = Project.objects.prefetch_related('team').all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

# PUT /project/<id>/add-member/        - Add a new member to the project
class ProjectAddMemberView(APIView):
    def put(self, request, id):
        project = get_object_or_404(Project, id=id)
        employee = get_object_or_404(Employee, id=request.data.get('employee_id'))
        project.team.add(employee)
        project.save()
        return Response({'message': 'Employee added to the project'}, status=status.HTTP_200_OK)

# GET /project/<id>/       - Get project details by ID
class ProjectDetailView(APIView):
    def get(self, request, id):
        project = get_object_or_404(Project, id=id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

# DELETE /project/<id>/        - Delete a project (only if the end date has passed)
class ProjectDeleteView(APIView):
    def delete(self, request, id):
        project = get_object_or_404(Project, id=id)
        if project.end_date and project.end_date < timezone.now().date():
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Project cannot be deleted before the end date.'}, status=status.HTTP_400_BAD_REQUEST)

# PUT /project/<id>/update-status/         - Update the status of the project
class ProjectUpdateStatusView(APIView):
    def put(self, request, id):
        project = get_object_or_404(Project, id=id)
        project_status = request.data.get('status')
        if project_status in ['NEW', 'ON-GOING', 'ENDED']:
            project.status = project_status
            project.save()
            return Response({'status': 'Project status updated'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Status'}, status=status.HTTP_400_BAD_REQUEST)

# GET /project/<id>/budget/ - Get the budget of the project based on employee salaries
class ProjectBudgetView(APIView):
    def get(self, request, id):
        project = get_object_or_404(Project, id=id)
        budget = project.team.aggregate(total_salary=Sum('salary'))['total_salary']
        return Response({'budget': budget})
    
# GET /employee/highest-salary/        - Get the highest salary holders
class HighestSalaryEmployeeView(APIView):
    def get(self, request):
        highest_salary = Employee.objects.aggregate(max_salary=Max('salary'))['max_salary']
        employees = Employee.objects.filter(salary=highest_salary)
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

# GET /employee/second-highest-salary/         - Get the second-highest salary holder grouped by department
class SecondHighestSalaryEmployeeView(APIView):
    def get(self, request):
        second_highest_salaries = Employee.objects.values('department').annotate(second_highest=Max('salary')).order_by('-second_highest')
        return Response(second_highest_salaries)

# GET /department/total-salary/        - Get the total salary of employees under each department
class DepartmentTotalSalaryView(APIView):
    def get(self, request):
        departments = Department.objects.annotate(total_salary=Sum('employees__salary'))
        department_salary = [{'department': dept.name, 'total_salary': dept.total_salary} for dept in departments]
        return Response(department_salary)
    
# GET /project/status-new/         - Get all "NEW" projects
class NewProjectsView(APIView):
    def get(self, request):
        new_projects = Project.objects.filter(status='NEW')
        serializer = ProjectSerializer(new_projects, many=True)
        return Response(serializer.data)

# GET /project/status-on-going/        - Get all "ON-GOING" projects
class OngoingProjectsView(APIView):
    def get(self, request):
        ongoing_projects = Project.objects.filter(status='ON-GOING')
        serializer = ProjectSerializer(ongoing_projects, many=True)
        return Response(serializer.data)

# GET /project/status-ended/       - Get all "ENDED" projects
class EndedProjectsView(APIView):
    def get(self, request):
        ended_projects = Project.objects.filter(status='ENDED')
        serializer = ProjectSerializer(ended_projects, many=True)
        return Response(serializer.data)