# Generated by Django 4.2.11 on 2024-05-14 18:11

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0066_alter_match_start'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='start',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 14, 22, 11, 55, 138191)),
        ),
    ]
