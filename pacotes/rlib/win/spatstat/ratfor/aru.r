# $Id: aru.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine aru(n,a,b,iseed,rrr)
implicit double precision(a-h,o-z)
dimension iseed(3), rrr(n)

w = b-a
do i = 1,n {
	call arand(iseed(1),iseed(2),iseed(3),rv)
	rrr(i) = a + w*rv
}

return
end
