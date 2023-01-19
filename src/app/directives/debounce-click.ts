import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, throttleTime, auditTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() debounceTimeConst = 500;
    @Output() debounceClick = new EventEmitter();
    @Input() disabled = false;

    private clicks = new Subject();
    private subscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks.pipe(
            debounceTime(this.debounceTimeConst)
        ).subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        console.log(this.disabled)
        if (!this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            this.clicks.next(event);
        }
    }
}