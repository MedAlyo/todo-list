import { Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { BodyComponent } from './body/body.component';

export const routes: Routes = [
    {'path': 'Home', component:BodyComponent},
    {'path': 'add-task', component:AddTaskComponent},
    {'path': '', redirectTo:'Home', pathMatch:'full'},
    { path: '**', redirectTo: 'Home' }  // Redirige cualquier ruta no válida
];
