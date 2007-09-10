# $Id: cif.r,v 2.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine cif(nmbr,u,v,mark,ix,x,y,marks,npts,ntypes,par,period,
               cifval,aux)
#
# Conditional intensity function chooser. Note that (u,v) = the
# coordinates of the point at which the conditional intensity
# function is being evaluated.
#

implicit double precision(a-h,o-z)
dimension par(1), x(1), y(1), marks(1), period(2)
integer aux(1)

if(nmbr == 1) { # Strauss.
	call strauss(u,v,ix,x,y,npts,par,period,cifval)
}

else if(nmbr == 2) { # Strauss with hardcore.
	call straush(u,v,ix,x,y,npts,par,period,cifval)
}

else if(nmbr==3) { # Softcore.
	call sftcr(u,v,ix,x,y,npts,par,period,cifval)
}

else if(nmbr==4) { # Marked Strauss.
	call straussm(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval)
}

else if(nmbr == 5) { # Marked Strauss with hardcore.
	call straushm(u,v,mark,ix,x,y,marks,ntypes,npts,par,period,cifval)
}

else if(nmbr == 6) { # Diggle, Gates, and Stibbard, number 1.
	call dgs(u,v,ix,x,y,npts,par,period,cifval)
}

else if(nmbr == 7) { # Diggle-Gratton = Diggle, Gates, and Stibbard, number 2.
	call diggra(u,v,ix,x,y,npts,par,period,cifval)
}

else if(nmbr == 8) { # Geyer.
	call geyer(u,v,ix,x,y,npts,par,period,cifval,aux)
}

else if(nmbr == 9) { # Lookup.
	call lookup(u,v,ix,x,y,npts,par,period,cifval)
}

else {
	call fexit("Cif number is not in the range 1 to 9; bailing out.")
}

return
end
