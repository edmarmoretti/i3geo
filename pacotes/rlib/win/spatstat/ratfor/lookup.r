# $Id: lookup.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine lookup(u,v,ix,x,y,npts,par,period,cifval)
#
# Conditional intensity function for a general pairwise
# interaction process with the pairwise interaction function
# given by a ``lookup table'', passed through the par
# argument.
#

implicit double precision(a-h,o-z)
dimension par(5), x(1), y(1), period(2)
# Dimensioning par(5) is just a trick to keep g77 from bitching;
# par(1) is really adequate, and there is no telling what the real
# dimension is going to be.
logical per, equisp

zero = 0.d0
one  = 1.d0
per  = period(1) > zero
eps  = 2.22d-16 

beta   = par(1)
nlook  = par(2)
equisp = par(3) > zero
delta  = par(4)
rmax   = par(5)

if(npts==0) {
	cifval = beta
	return
}

# If the r-values are equispaced only the h vector is included in
# ``par'' after ``rmax''; the entries of h then consist of
# h(1) = par(6), h(2) = par(7), ..., h(k) = par(5+k), ...,
# h(nlook) = par(5+nlook).  If the r-values are NOT equispaced then
# the individual r values are needed and these are included as
# r(1) = par(6+nlook), r(2) = par(7+nlook), ..., r(k) = par(5+nlook+k),
# ..., r(nlook) = par(5+2*nlook).

some = zero
do j = 1,npts {
	if(j == ix) continue
	else {
		if(per) call dist2(u,v,x(j),y(j),period,r2)
		else r2 = (u-x(j))**2 + (v-y(j))**2
		# Now calculate ``h(r1)'' --- r1 = sqrt(r2).
		r1 = sqrt(r2)
		if(r1 >= rmax) k0 = nlook
		else {
			k0 = 1 + int(r1/delta)
			if(equisp) k0 = min(k0,nlook)
			else {
				ks = 1 + int(r1/delta)
				rks = par(5+nlook+ks)
				if(rks <= r1) {
					ksp1 = ks + 1
					do k = ksp1,nlook {
						rk = par(5+nlook+k)
						if(r1 < rk) {
							k0 = k-1
							break
						}
					}
				} else {
					ksm1 = ks - 1
					do k = ksm1,1,-1 {
						rk = par(5+nlook+k)
						if(r1 >= rk) {
							k0 = k
							break
						}
					}
				}
			}
		}
		hk0 = par(5+k0)
		if(hk0 <= eps) {
			cifval = zero
			return
		}
		some = some + log(hk0)
	}
}

cifval = beta*exp(some)

return
end
