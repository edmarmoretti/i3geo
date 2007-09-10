# $Id: geyer.r,v 1.3 2006/10/19 10:22:21 adrian Exp adrian $
subroutine geyer(u,v,ix,x,y,npts,par,period,cifval,aux)
#
# Conditional intensity function for a Geyer process.
#

implicit double precision(a-h,o-z)
dimension par(4), x(1), y(1), period(2)
integer aux(1)
logical per, newpt

eps  = 2.22d-16 # Essentially .Machine$double.eps from Splus.
zero = 0.d0
one  = 1.d0
per  = period(1) > zero

beta  = par(1)
gamma = par(2)
r2    = par(3) # This is the ***squared*** radius; avoids needing square root.
s     = par(4)

if(npts==0) {
	cifval = beta
	return
}

# Check on type of event.  (Makes a difference to how the value
# of c1 = t((u,v),X) is calculated.):
#
# ix < 0          <--> proposing simple birth
# ix > 0 & !newpt <--> proposing death
# ix > 0 & newpt  <--> proposing shift from (x(ix), y(ix)) to (u, v).

if(ix > 0) {
	if(per) call dist2(u,v,x(ix),y(ix),period,d2)
	else d2 = (u-x(ix))**2 + (v-y(ix))**2
	newpt = d2 > eps
}
else newpt = .true.

if(newpt) c1 = zero
else      c1 = dble(aux(ix))

c2 = zero

do j = 1,npts {
	if(j == ix) next
	if(ix > 0) {
		if(per) call dist2(x(ix),y(ix),x(j),y(j),period,d2)
		else d2 = (x(ix)-x(j))**2 + (y(ix)-y(j))**2
		if(d2 < r2) a1 = one
		else a1 = zero
	}
	else a1 = zero
	if(newpt) {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(d2 < r2) a2 = one
		else a2 = zero
		c1 = c1 + a2
	}
	else a2 = a1
	a0 = dble(aux(j))
	c2 = c2 + min(s,a0-a1+a2) - min(s,a0-a1)
}

count = min(s,c1) + c2
if(gamma < eps ) {
	if(count > zero) cifval = zero
	else cifval = beta
}
else cifval = beta*exp(log(gamma)*count)

return
end
