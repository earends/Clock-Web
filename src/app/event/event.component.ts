import { Component, OnInit } from '@angular/core';
import {EventService} from '../event.service';
import { ActivatedRoute ,Router} from '@angular/router';
import {Event} from '../event';
import {Location} from '@angular/common';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';
import { observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  event:Event;
  constructor(
    private _eventService:EventService,
    private route: ActivatedRoute,
    private location: Location,
    private _guestService:GuestService,
    private router:Router
    ) { }

  pin:number;
  guestToUpdate:Guest;
  guest:Guest = new Guest();
  nullName:boolean = false;
  no_name:Boolean = false;
  guests:Guest [];
  nameTag = "<span>Name</span>";
  showGuests:boolean = false;

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.GetEvent(id);
    this.getGuests(id);
    this.guest.eventId = id;
  }

  getGuests(id:number) {
    
    this._guestService.GetGuestsByEvent(id)
      .subscribe(e => this.guests = e)
  }

  GetEvent(id:number) {
    
    this._eventService.GetEvent(id)
      .subscribe(e => this.event = e)
  }


  onGoing() {
    this.handleGuestInput("Going");
  }

  onNotGoing() {
    this.handleGuestInput("Not Going");
  }

  onMaybe() {
    this.handleGuestInput("Maybe");
  }

  handleGuestInput(status:string) {
    if (!this.checkPin(this.pin)) {
      this.nameTag = "<span>Incorrect Pin</span>";
      return;
    }
    if (this.guest.name != "" && this.guest.name != null) 
    {
      if (this.isNewGuest()) 
      {
        this.guest.status = status;
        this._guestService.postGuest(this.guest)
          .subscribe(e =>  this.router.navigate([`/Events`]));  
      } 
      else 
      {
        this.guestToUpdate.status = status;
        this._guestService.updateGuest(this.guestToUpdate)
        .subscribe((e) => {
          console.log(e);
        },
        (err) => {console.log(err)});
        this.nameTag = "<span>" + this.guestToUpdate.name + " Is " + this.guestToUpdate.status + "</span>";
      }
      
    } 
    else 
    {
      this.nameTag = "<span>PLEASE INCLUDE A NAME</span>";
    }
    
  }

  isNewGuest() {
    var result = true;
    this.guests.forEach(g => {
      console.log(this.guest.name);
      console.log(g.name);
        if (g.name.toLowerCase() == this.guest.name.toLowerCase()) {
          this.guestToUpdate = g;
          return result = false;
        }
      });
      if (result) {
        return true;
      } else {
        return false; 
      }
      
  }

  goBack(): void {
    this.location.back();
  }

  checkPin(pin:number):boolean {
    if (this.pin == environment.guestPin) {
      return true;
    } else {
      return false;
    }
  }

  onShowGuests() {
    console.log(this.guests);
    this.showGuests = true;
  }

}
