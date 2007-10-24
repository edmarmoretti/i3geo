# $Id: straushm.r,v 1.3 2006/10/19 10:22:21 adrian Exp adrian $
subroutine straushm(u,v,mrk,ix,x,y,marks,ntypes,n,par,period,cifval)
#
# Conditional intensity function for a marked
# combination Strauss/hardcore process.
# Argument list: u,v,mrk,i,x,y,marks,ntypes,n,par,cifval.
#
# Entries of par:
# beta_i, 1 <= i <= ntypes; gamma_ij, 1 <= i <=j <= ntypes,
# rint^2_ij, 1 <= i <=j <= ntypes, rhc^2_ij, 1 <= i <=j <= ntypes.


implicit double precision(a-h,o-z)
dimension x(n), y(n), marks(n), par(1), period(2)
dimension gmma(100), rint(100), rhc(100), k(100)
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

# Squared interaction radii. (Squared so as to avoid taking
# square roots of squared distances.):

ind = ntypes + ntypes*(ntypes+1)/2
do i = 1,mrk {
        do j = i,ntypes {
                ind = ind+1
                if(i<=mrk & j==mrk) rint(i) = par(ind)
                if(i==mrk & j>mrk)  rint(j) = par(ind)
                # Note radii have already been squared `back in R'.
	}
}

# Squared hard core radii. (Squared so as to avoid taking
# square roots of squared distances.):
ind = ntypes + ntypes*(ntypes+1)
do i = 1,mrk {
        do j = i,ntypes {
                ind = ind+1
                if(j==mrk) rhc(i) = par(ind)
                if(i==mrk & j>mrk)  rhc(j) = par(ind)
                # Note radii have already been squared `back in R'.
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
		if(d2 < rhc(marks(j))) {
			cifval = zero
			return
		}
                if(d2 <= rint(marks(j)))
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
