# $Id: initaux.r,v 1.4 2006/10/19 10:22:21 adrian Exp adrian $
subroutine initaux(nmbr,par,period,x,y,npts,aux)
implicit double precision(a-h,o-z)
dimension x(1), y(1), par(3), period(2)
# Dimensioning par(3) is just a trick to keep g77 from bitching;
# par(1) is really adequate.
integer aux(1)
logical per

if(nmbr != 8) return

zero = 0.d0
per  = period(1) > zero
r2   = par(3)  # Was squared already, `back in R'.

do i = 1, npts {
	aux(i) = 0
	do j = 1,npts {
		if(j==i) next
		if(per) call dist2(x(i),y(i),x(j),y(j),period,d2)
		else d2 = (x(i)-x(j))**2 + (y(i)-y(j))**2
		if(d2 < r2) aux(i) = aux(i) + 1
	}
}

return
end
