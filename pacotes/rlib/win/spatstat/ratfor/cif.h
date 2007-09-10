  ##
  ##  Map from NMBR to conditional intensity functions etc
  ##

#if (NMBR == 1)
#define MHNAME mh1
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
 strauss(u,v,ix,x,y,npts,par,period,cifval)

#elif (NMBR == 2)
#define MHNAME mh2
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
  straush(u,v,ix,x,y,npts,par,period,cifval)

#elif (NMBR == 3)
#define MHNAME mh3
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
	sftcr(u,v,ix,x,y,npts,par,period,cifval)

#elif (NMBR==4)
#define MHNAME mh4
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
	straussm(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval)
#define MARKED

#elif (NMBR == 5)
#define MHNAME mh5
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
	 straushm(u,v,mark,ix,x,y,marks,ntypes,npts,par,period,cifval)
#define MARKED

#elif (NMBR == 6)
#define MHNAME mh6
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
         dgs(u,v,ix,x,y,npts,par,period,cifval)

#elif (NMBR == 7) 
#define MHNAME mh7
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
	diggra(u,v,ix,x,y,npts,par,period,cifval)

#elif (NMBR == 8) 
#define MHNAME mh8
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
         geyer(u,v,ix,x,y,npts,par,period,cifval,aux)

#elif (NMBR == 9) 
#define MHNAME mh9
#define CIF(u,v,mark,ix,x,y,marks,npts,ntypes,par,period,cifval,aux) \
	 lookup(u,v,ix,x,y,npts,par,period,cifval)
#endif

