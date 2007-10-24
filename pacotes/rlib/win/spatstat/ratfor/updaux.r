# $Id: updaux.r,v 1.4 2006/10/19 10:22:21 adrian Exp adrian $
subroutine updaux(itype,x,y,u,v,npts,ix,par,period,aux)
implicit double precision(a-h,o-z)
dimension x(1), y(1), par(3), period(2)
# Dimensioning par(3) is just a trick to keep g77 from bitching;
# par(1) is really adequate.
integer aux(1)
logical per

zero = 0.d0
r2   = par(3)   # Was squared already, `back in R'.
per  = period(1) > zero

if(itype == 1) { # Birth
	nm1 = npts-1
	aux(npts) = 0

	do j = 1,nm1 {
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(d2 < r2) {
			aux(j) = aux(j)+1
			aux(npts) = aux(npts)+1
		}
	}
	return
}

if(itype == 2) { # Death
	do j = 1,npts {
		if(j==ix) next
		if(per) call dist2(x(ix),y(ix),x(j),y(j),period,d2)
		else d2 = (x(ix)-x(j))**2 + (y(ix)-y(j))**2
		if(d2 < r2) {
			if(j < ix) aux(j) = aux(j) - 1
			else aux(j-1) = aux(j) - 1
		}
		else if(j>=ix) aux(j-1) = aux(j)
	}
	aux(npts) = 0
	return
}

if(itype == 3) { # Shift
	aux(ix) = 0
	do j = 1, npts {
		if(j == ix) next
		if(per) call dist2(u,v,x(j),y(j),period,d2)
		else d2 = (u-x(j))**2 + (v-y(j))**2
		if(per) call dist2(x(ix),y(ix),x(j),y(j),period,d2i)
		else d2i = (x(ix)-x(j))**2 + (y(ix)-y(j))**2
		if(d2 < r2) {
			aux(ix) = aux(ix) + 1
			if(d2i >= r2) aux(j)  = aux(j) + 1
		}
		else if(d2i < r2) aux(j) = aux(j) - 1
	}
	return
}

call fexit("Argument itype to updaux must be 1, 2, or 3; bailing out.")

end
