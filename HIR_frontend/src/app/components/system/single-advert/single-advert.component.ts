import { Component, input, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Ad } from '../../../interfaces/ad';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-single-advert',
  standalone: true,
  imports: [CardModule],
  templateUrl: './single-advert.component.html',
  styleUrl: './single-advert.component.scss'
})
export class SingleAdvertComponent {

  advert?: Ad;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.api.selectById('adverts', id).subscribe({
        next: (res) => this.advert = res as Ad,
        error: (err) => console.error(err)
      });
      console.log(this.advert);
    } else {
      console.warn('No advert id in route');
    }
  }
}
