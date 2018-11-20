import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/Dish'
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader'
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
    host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
       expand()
    ]
})
export class HomeComponent implements OnInit {

  dishErrMess:string;
  dish: Dish;
  promotionErrMess:string;
  promotion: Promotion;
  leader:Leader;


  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService:LeaderService,
  @Inject('BaseURL')private baseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish);
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader);

  }


}
