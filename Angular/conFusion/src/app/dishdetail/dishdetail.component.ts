import { Component, OnInit,Input,ViewChild,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { visibility } from '../animations/app.animation';

import { DISHES } from '../shared/dishes';
import { HttpClient } from '@angular/common/http';

import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { switchMap } from 'rxjs/operators';

import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
      visibility()
    ]
})


export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  errMess: string;
  commentForm: FormGroup;
  dishcopy: Dish;
  livecomment:Comment;
  visibility = 'shown';
  dishIds: string[];
  prev: string;
  next: string;

  @Input()
  dish: Dish;

  formErrors = {
   'author': '',
   'comment':''
 };

 validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
    },
    'comment':{
      'required':'Comment is required',
    }
  };


  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
  @Inject('BaseURL')private baseURL) {

    this.createForm();
  }

    ngOnInit() {
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);

      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
      rating:5,
      comment:''
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.createForm();

    this.dishcopy.comments.push({
      rating:this.commentForm.getRawValue().rating,
      comment:this.commentForm.getRawValue().comment.toString(),
      author:this.commentForm.getRawValue().author.toString(),
      date:(new Date).toISOString()
    });
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });

    /*for(var item of DISHES){
      if(item.id==this.location.path(true)[this.location.path(true).length-1]){
        item.comments.push({
          rating:this.commentForm.getRawValue().rating,
          comment:this.commentForm.getRawValue().comment,
          author:this.commentForm.getRawValue().author,
          date:(new Date).toISOString()
        })
      }
    }*/
  }
}
