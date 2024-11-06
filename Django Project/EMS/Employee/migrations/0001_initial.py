# Generated by Django 5.1.2 on 2024-10-19 17:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('salary', models.FloatField()),
                ('designation', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=255)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Employee.department')),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('NEW', 'New'), ('ON-GOING', 'On-going'), ('ENDED', 'Ended')], default='NEW', max_length=10)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('team', models.ManyToManyField(blank=True, related_name='team_projects', to='Employee.employee')),
                ('team_lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='led_projects', to='Employee.employee')),
            ],
        ),
        migrations.AddField(
            model_name='employee',
            name='projects',
            field=models.ManyToManyField(related_name='employees', to='Employee.project'),
        ),
    ]