import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TableControlsComponent } from './components/table-controls/table-controls.component';
import { TableScrollDirective } from './directives/table-scroll.directive';
import { TableSortComponent } from './components/table-sort/table-sort.component';
import { TableSearchComponent } from './components/table-search/table-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TableControlsComponent,
    HttpClientModule,
    TableScrollDirective,
    TableSortComponent,
    FormsModule,
    ReactiveFormsModule,
    TableSearchComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
