# $Id: arand.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine arand(ix,iy,iz,rand)
implicit double precision(a-h,o-z)

#
#	RANDOM NUMBER GENERATOR
#
#	Wichmann, B. A. & Hill, I. D. (1982)
#	Algorithm AS 183: 
#	An efficient and portable pseudo-random number generator
#	Applied Statistics 31 (1982) 188-190
#
#	see also: 
#		Correction to Algorithm AS 183
#		Applied Statistics 33 (1984) 123  
#
#		McLeod, A. I. (1985)
#		A remark on Algorithm AS 183 
#		Applied Statistics 34 (1985),198-200
#

ix = 171 * (ix - 177*(ix/177)) -  2 * (ix/177)
iy = 172 * (iy - 176*(iy/176)) - 35 * (iy/176)
iz = 170 * (iz - 178*(iz/178)) - 63 * (iz/178)

if (ix < 0) ix = ix + 30269
if (iy < 0) iy = iy + 30307
if (iz < 0) iz = iz + 30323

term = ix/30269.d0 + iy/30307.d0 + iz/30323.d0
iterm = term
if(iterm > term) iterm = iterm - 1
rand = term - iterm

if(rand < 1.d0) continue
else rand = 0.999999d0

return
end
