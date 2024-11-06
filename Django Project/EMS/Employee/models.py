from django.db import models

class Department(models.Model) :

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
 
    
class Employee(models.Model) :

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    salary = models.FloatField()
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(Department, related_name='employees', on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    projects = models.ManyToManyField('Project', related_name='employees')


class Project(models.Model) :

    STATUS_CHOICES = [
        ('NEW', 'New'), 
        ('ON-GOING', 'On-going'), 
        ('ENDED', 'Ended'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    team = models.ManyToManyField(Employee, related_name='team_projects',blank=True)
    team_lead = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='led_projects')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='NEW')
    start_date = models.DateField()
    end_date = models.DateField()

    
    