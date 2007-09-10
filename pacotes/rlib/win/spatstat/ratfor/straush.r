# $Id: straush.r,v 1.3 2006/10/19 10:22:21 adrian Exp adrian $
subroutine straush(u,v,ix,x,y,n,par,period,cifval)
#
# Conditional intensity function for a Strauss process with a
# ``hardcore centre''.  Argument list: u,v,i,x,y,n,par,cifval.
#

implicit double precision(a-h,o-z)
dimension par(4), x(n), y(n), period(2)
logical per

eps  = 2.22d-16 # Essentially .Machine$double.eps from Splus.
zero = 0.d0
per  = period(1) > zero


beta  = par(1)
gamma = par(2)
ri    = par(3) # Squared interaction radius; squaring done ``back in R''.
rhc   = par(4) # Squared hard core radius; squaring done ``back in R''.

if(n==0) {
	cifval = beta
	return
}

kount = 0
  do j = 1,n {
	if(j == ix) continue
	else {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(d2 < rhc) {
			cifval = zero
			return
		}
		if(d2 < ri) kount = kount+1
	}
      }


if(gamma < eps) {
	if(kount > 0) cifval = zero
	else cifval = beta
}
else cifval = beta*exp(log(gamma)*dble(kount))

return
end
