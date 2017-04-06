BEGIN 	{print "start"}
		{
			if(/let/)
				print $0
			else if(/item/)
				print ">" $0
		}
END 	{print "end"}

