# $Id: straussm.r,v 2.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine straussm(u,v,mrk,ix,x,y,marks,n,ntypes,par,period,cifval)
#
# Conditional intensity function for a marked Strauss process.
# Argument list: u,v,mrk,ix,x,y,marks,n,ntypes,par,cifval.
#
# Entries of par:
# beta_i, 1 <= i <= ntypes; gamma_ij, 1 <= i <=j <= marks,
# r_ij, 1 <= i <=j <= marks.

implicit double precision(a-h,o-z)
dimension x(n), y(n), marks(n), par(1), period(2)
dimension gmma(100), rad(100), k(100)   # If ntypes exceeds 100, the user
                                        # is fucked in the head!!!
logical per

eps  = 2.22d-16 # Essentially .Machine$double.eps from Splus.
zero = 0.d0
per  = period(1) > zero

# Beta:
beta = par(mrk)

if(n==0) {
	cifval = beta
	return
}

# Gammas:
ind = ntypes
do i = 1,mrk {
	do j = i,ntypes {
		ind = ind+1
		if(i<=mrk & j==mrk) gmma(i) = par(ind)
		if(i==mrk & j>mrk)  gmma(j) = par(ind)
	}
}
# Squared radii. (Squared so as to avoid taking square roots
# of distances.):

ind = ntypes + ntypes*(ntypes+1)/2
do i = 1,mrk {
        do j = i,ntypes {
                ind = ind+1 
		if(i<=mrk & j==mrk) rad(i) = par(ind)
		if(i==mrk & j>mrk)  rad(j) = par(ind)
		# Note that the radii were already squared, ``back in R''.
	}
}

# Zero the counts:
do i = 1,ntypes {
	k(i) = 0
}

# Count the r-close pairs.
  do j = 1,n {
	if(j == ix) continue
	else {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(d2 <= rad(marks(j)))
			k(marks(j)) = k(marks(j))+1
              }
      }

cifval = zero

do i=1,ntypes {
	if(gmma(i) < eps) {
		if(k(i)>0) {
			cifval = zero
			return
		}
	}
	else cifval = cifval + log(gmma(i))*dble(k(i))
}

cifval = beta*exp(cifval)

return
end
