# Generated by Django 4.0.3 on 2022-03-05 04:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PersonaModel',
            fields=[
                ('personaId', models.AutoField(db_column='id', primary_key=True, serialize=False, unique=True)),
                ('personaNombre', models.CharField(db_column='nombre', max_length=50)),
                ('personaApellido', models.CharField(db_column='apellido', max_length=50)),
                ('personaEmail', models.EmailField(db_column='email', max_length=50, unique=True)),
                ('personaFechaNac', models.DateField(db_column='fec_nac')),
                ('personaEstadoCivil', models.CharField(choices=[('SOLTERO', 'SOLTERO'), ('CASADO', 'CASADO'), ('VIUDO', 'VIUDO'), ('DIVORCIADO', 'DIVORCIADO'), ('COMPLICADO', 'COMPLICADO'), ('NO_ESPECIFICA', 'NO_ESPECIFICA')], db_column='estado_civil', default='NO_ESPECIFICA', max_length=50)),
                ('personaFoto', models.ImageField(db_column='foto', null=True, upload_to='personas/')),
            ],
            options={
                'db_table': 'personas',
            },
        ),
        migrations.CreateModel(
            name='CitasModel',
            fields=[
                ('citaId', models.AutoField(db_column='id', primary_key=True, serialize=False, unique=True)),
                ('citaDescripcion', models.TextField(db_column='descripcion')),
                ('citaFecha', models.DateTimeField(db_column='fecha')),
                ('citaLatitud', models.FloatField(db_column='latitud')),
                ('citaLongitud', models.FloatField(db_column='longitud')),
                ('citaEstado', models.CharField(choices=[('ACTIVA', 'ACTIVA'), ('CANCELADA', 'CANCELADA'), ('POSTPUESTA', 'POSTPUESTA')], db_column='estado', max_length=50)),
                ('createdAt', models.DateTimeField(auto_now_add=True, db_column='created_at')),
                ('updatedAt', models.DateTimeField(auto_now=True, db_column='updated_at')),
                ('citado', models.ForeignKey(db_column='citado_id', on_delete=django.db.models.deletion.PROTECT, related_name='personaCitadas', to='core.personamodel')),
                ('citador', models.ForeignKey(db_column='citador_id', on_delete=django.db.models.deletion.PROTECT, related_name='personaCitas', to='core.personamodel')),
            ],
            options={
                'db_table': 'citas',
                'ordering': ['-citaFecha'],
                'unique_together': {('citaFecha', 'citador'), ('citaFecha', 'citado')},
            },
        ),
    ]