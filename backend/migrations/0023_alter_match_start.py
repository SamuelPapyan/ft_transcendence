# Generated by Django 4.2.11 on 2024-05-04 19:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0022_alter_match_start'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='start',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 4, 23, 26, 16, 472591)),
        ),
    ]
