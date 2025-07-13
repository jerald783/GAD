import { Component, Input, OnInit } from '@angular/core';
import { ReposService } from '../../../../services/adminServices/repos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-repo',
  standalone: false,
  templateUrl: './add-edit-repo.component.html',
  styleUrl: './add-edit-repo.component.scss'
})
export class AddEditRepoComponent implements OnInit {
  constructor(
    private service: ReposService,
    private toastr: ToastrService // private toast: NgToastService
  ) {}
  @Input() repo: any;
  id: string | undefined;
  Date: string | undefined;
  Project_Title: string | undefined;
  Project_Leader: string | undefined;
  Funding_Source: string | undefined;
  Budget: string | undefined;

  RepositoryList : any = [];
  ngOnInit(): void {
    this.loadRepoList();
 
  }

  loadRepoList() {
    this.service.getRepoList().subscribe((data: any) => {
      this.RepositoryList = data;
      this.id = this.repo.id;
      this.Date = this.repo.Date;
      this.Project_Title = this.repo.Project_Title;
      this.Project_Leader = this.repo.Project_Leader;
      this.Funding_Source = this.repo.Funding_Source;
      this.Budget = this.repo.Budget;

    
    });
  }

  addRepository() {
    var val = {
      id: this.id,
      Date: this.Date,
      Project_Title: this.Project_Title,
      Project_Leader: this.Project_Leader,
      Funding_Source: this.Funding_Source,
      Budget:this.Budget
    };

    this.service.addRepository(val).subscribe((res) => {
      // alert(res.toString());
      this.toastr.success('Added Successfully', 'Added');
    });
  }

  updateRepository() {
    var val = {
      id: this.id,
      Date: this.Date,
      Project_Title: this.Project_Title,
      Project_Leader: this.Project_Leader,
      Funding_Source: this.Funding_Source,
      Budget:this.Budget
    };

    this.service.updateRepository(val).subscribe((res) => {
      // alert(res.toString());
      this.toastr.warning('Updated Successfully', 'Updated');
    });
  }
  }
