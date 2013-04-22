#/bin/python2.7

import sys
import os
import shutil

def copy_to(paths, to_path):
    if not os.path.exists(to_path):
        sys.stderr.write('copy_to error: invalid argument\n')
        sys.exit(1)

    for path in paths:
        filename = os.path.basename(path)
        shutil.copy(path, os.path.join(to_path, filename))

def get_special_paths(dir, unInclude_list):
    filenames = os.listdir(dir)
    paths = []

    if not filenames:
        sys.stderr.write('get_specal_paths error: invalid argument\n')
        sys.exit(1)

    for filename in filenames:
        if filename not in unInclude_list:
            paths.append(os.path.abspath(os.path.join(dir, filename)))

    return paths

def main():
    args = sys.argv[1:]
    deploy_path = 'MapApi/public/deploy'

    if args[0] == '--deploy' or args[0] == '-d':
        if not os.path.exists(deploy_path):
            os.makedirs(deploy_path)

        unInclude_list = ['MapApi', 'README.md', '.git', __file__]
        paths = get_special_paths('./', unInclude_list)
        copy_to(paths, deploy_path)

    elif args[0] == '--undeploy' or args[0] == '-u':
        if not os.path.exists(deploy_path):
            sys.stderr.write('No deploy dir\n')
            sys.exit(1)

        paths = get_special_paths(deploy_path, [])
        copy_to(paths, './')
        shutil.rmtree(deploy_path)
    else:
        sys.stderr.write('invalid arguments\n')
        sys.exit(1)

if __name__ == '__main__':
    main()
