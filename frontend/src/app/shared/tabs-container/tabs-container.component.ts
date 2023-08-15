import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  constructor() {}

  selectTab(tab: TabComponent) {
    this.tabs?.forEach((tab: TabComponent) => {
      tab.active = false;
    });

    tab.active = true;

    return false; // because of returning false angular will automatically prevent the default behaviour of the links on which we are handeling the click event in the template file
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => {
      return tab.active;
    });

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }
}
