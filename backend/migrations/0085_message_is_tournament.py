# Generated by Django 4.2.11 on 2024-05-23 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0084_message_is_invitation'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='is_tournament',
            field=models.BooleanField(default=False),
        ),
    ]