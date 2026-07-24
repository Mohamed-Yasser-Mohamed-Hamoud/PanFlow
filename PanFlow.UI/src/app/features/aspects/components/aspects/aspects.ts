import { Component, inject, OnInit } from '@angular/core';
import { AspectService } from './aspect-service';
import { ViewMode } from "../view-mode/view-mode";
import { CreateMode } from "../create-mode/create-mode";
import { EditMode } from "../edit-mode/edit-mode";
import { ListMode } from '../list-mode/list-mode';

@Component({
  selector: 'app-aspects',
  imports: [ViewMode, CreateMode, EditMode, ListMode],
  templateUrl: './aspects.html',
  styleUrl: './aspects.css',
})
export class Aspects implements OnInit {
  public aspectService = inject(AspectService);

  ngOnInit(): void {
    this.aspectService.loadAspects();
  }
}