# $Id: fexitf.r,v 1.2 2006/10/19 10:22:21 adrian Exp adrian $
subroutine fexit(msg)
character*(*) msg
nc = len(msg)
call fexitc(msg, nc)
end
