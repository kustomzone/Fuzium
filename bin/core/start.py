#!/usr/bin/env python2.7
import sys
import zeronet

def main():
    sys.argv = [sys.argv[0] + sys.argv[1:]]
    zeronet.main()

if __name__ == '__main__':
    main()
