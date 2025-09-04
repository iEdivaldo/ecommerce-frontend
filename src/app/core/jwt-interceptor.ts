import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    if (auth.autenticado()) {
        const token = auth.token();
        if (token) {
            console.log(token)
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    }
    return next(req);
};