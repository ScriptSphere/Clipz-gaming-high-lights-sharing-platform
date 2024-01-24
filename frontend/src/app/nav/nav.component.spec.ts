import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { NavComponent } from './nav.component';
import { UserManipService } from '../services/user-manip.service';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedUserManipService = jasmine.createSpyObj(
    'UserManipService',
    ['registerUser', 'logoutUser'],
    {
      loggedIn: true,
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      providers: [
        { provide: UserManipService, useValue: mockedUserManipService },
      ],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logout link', () => {
    const logoutLink = fixture.debugElement.query(By.css('#logoutLink'));

    expect(logoutLink)
      .withContext('Logout link is not rendering...')
      .toBeTruthy();

    console.log(logoutLink);

    logoutLink.triggerEventHandler('click');

    const service = TestBed.inject(UserManipService);

    expect(service.logoutUser)
      .withContext('Could not click logout link')
      .toHaveBeenCalledTimes(1);
  });
});
