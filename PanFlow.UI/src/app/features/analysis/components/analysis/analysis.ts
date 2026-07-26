import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisService } from './analysis-service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './analysis.html',
  styleUrl: './analysis.css',
  providers: [AnalysisService]
})
export class Analysis implements OnInit {
  public analysisService = inject(AnalysisService);

  ngOnInit(): void {
    this.analysisService.loadAnalytics();
  }
}
