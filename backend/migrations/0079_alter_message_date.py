# Generated by Django 4.2.11 on 2024-05-18 12:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0078_remove_channel_type_channel_is_dm_alter_message_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2024, 5, 18, 16, 20, 34, 639724)),
        ),
    ]
