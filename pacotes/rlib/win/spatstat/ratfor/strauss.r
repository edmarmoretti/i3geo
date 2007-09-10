# $Id: strauss.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine strauss(u,v,ix,x,y,n,par,period,cifval)
#
# Conditional intensity function for a Strauss process.
#

implicit double precision(a-h,o-z)
dimension par(3), x(1), y(1), period(2)
logical per

eps  = 2.22d-16 # Essentially .Machine$double.eps from Splus.
zero = 0.d0
per  = period(1) > zero

beta  = par(1)
gamma = par(2)
r     = par(3) # Was squared already, ``back in R''.

if(n==0) {
	cifval = beta
	return
}

kount = 0

if(per) {
  # periodic distance
  ixm1 = ix - 1
  ixp1 = max(1, ix + 1)
  if(ixm1 > 0) {
    do j = 1,ixm1 {
      call dist2(u,v,x(j),y(j),period,d2)
      if(d2 < r) kount = kount+1
    }
  }
  if(ixp1 <= n) {
    do j = ixp1,n {
      call dist2(u,v,x(j),y(j),period,d2)
      if(d2 < r) kount = kount+1
    }
  }
} else {
  # Euclidean distance
  ixm1 = ix - 1
  ixp1 = max(1, ix + 1)
  if(ixm1 > 0) {
    do j = 1,ixm1 {
      a = r - (u - x(j))**2
      if(a > 0) {
        a = a - (v-y(j))**2
        if(a > 0) kount = kount+1
      }
    }
  }
  if(ixp1 <= n) {
    do j = ixp1,n {
      a = r - (u - x(j))**2
      if(a > 0) {
        a = a - (v-y(j))**2
        if(a > 0) kount = kount+1
      }
    }
  }
}

if(gamma < eps ) {
	if(kount > 0) cifval = zero
	else cifval = beta
}
else cifval = beta*exp(log(gamma)*dble(kount))

return
end
