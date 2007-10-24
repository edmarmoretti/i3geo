# $Id: sftcr.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine sftcr(u,v,ix,x,y,n,par,period,cifval)
#
# Conditional intensity function for a Soft Core process.
# Argument list:  u,v,ix,x,y,n,par,cifval.
#
implicit double precision(a-h,o-z)
double precision kappa
dimension par(3), x(n), y(n), period(2)
logical per

zero   = 0.d0
one    = 1.d0
two    = 2.d0
beta   = par(1)
sigma  = par(2)
kappa  = par(3)
oneomk = -one/kappa
twook  = two/kappa
per    = period(1) > zero

if(n==0) {
	cifval = beta
	return
}

sx = zero
do j = 1,n {
	if(j == ix) continue
	else {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		sx = sx + exp(oneomk*log(d2))
	}
}

cifval = beta*exp(-(sigma**twook)*sx)

return
end
