# Generated by Django 4.2.11 on 2024-04-25 14:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0008_alter_match_start_alter_message_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='start',
            field=models.DateTimeField(default=datetime.datetime(2024, 4, 25, 18, 48, 6, 552321)),
        ),
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 4, 25, 18, 48, 6, 553322)),
        ),
    ]