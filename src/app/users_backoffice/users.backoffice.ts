import { Component, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { UserInterface as CurrentUser } from "../auth/userInterface";