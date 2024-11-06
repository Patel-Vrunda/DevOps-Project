from rest_framework import serializers
from .models import Employee, Department, Project

class DepartmentSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Department
        fields = '__all__'
    
class ProjectSerializer(serializers.ModelSerializer) :
    team = serializers.PrimaryKeyRelatedField(many=True, queryset=Employee.objects.all())

    class Meta :
        model = Project
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer) :
    projects = serializers.PrimaryKeyRelatedField(many=True, queryset=Project.objects.all())

    class Meta :
        model = Employee
        fields = '__all__'
    