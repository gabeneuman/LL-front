import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoaderSevice {
    public loader$: BehaviorSubject<boolean> = new BehaviorSubject(false)

    public showLoading(val: boolean): void {
        this.loader$.next(val);
    }
}